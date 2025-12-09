const { Sequelize } = require("sequelize");
const config = require("../../config");
const initModels = require("../../models/init-models");

const sequelize = new Sequelize(
	config.postgres.database,
	config.postgres.user,
	config.postgres.password,
	{
		host: config.postgres.host,
		port: config.postgres.port,
		dialect: "postgres",
		dialectOptions: {
			ssl: { rejectUnauthorized: false }
		},
		logging: false
	}
);

const models = initModels(sequelize);

async function crear(tareaData) {
	const transaction = await sequelize.transaction();
	try {
		const diasPayload = Array.isArray(tareaData.dias) ? tareaData.dias : [];
		const payload = { ...tareaData };
		delete payload.dias;

		const tarea = await models.tareas.create(payload, { transaction });

		if (diasPayload.length > 0) {
			const diaIds = [];
			for (const d of diasPayload) {
				if (typeof d === 'number') {
					const found = await models.dias.findByPk(d, { transaction });
					if (found) diaIds.push(d);
				} else if (typeof d === 'string') {
					const found = await models.dias.findOne({
						where: sequelize.where(sequelize.fn('lower', sequelize.col('dia')), d.toLowerCase()),
						transaction
					});
					if (found) diaIds.push(found.dia_id);
				}
			}

			if (diaIds.length > 0) {
				const rows = diaIds.map(did => ({ dia_id: did, tarea_id: tarea.tarea_id }));
				await models.dias_por_tarea.bulkCreate(rows, { transaction });
			}
		}

		await transaction.commit();
		return tarea.toJSON();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}

async function listarPorUsuario(uid) {
	try {
		const tareas = await models.tareas.findAll({
			where: { uid },
			order: [["fecha_creacion", "DESC"]]
		});
		return tareas.map(t => t.toJSON());
	} catch (err) {
		throw err;
	}
}

async function listarDias() {
	try {
		const dias = await models.dias.findAll({ order: [["dia", "ASC"]] });
		return dias;
	} catch (err) {
		throw err;
	}
}

async function obtenerPorId(tarea_id) {
	try {
		const tarea = await models.tareas.findByPk(tarea_id);
		return tarea ? tarea.toJSON() : null;
	} catch (err) {
		throw err;
	}
}

async function actualizar(tarea_id, cambios) {
	try {
		const [count, rows] = await models.tareas.update(cambios, {
			where: { tarea_id },
			returning: true
		});
		if (count === 0) return null;
		return rows[0].toJSON();
	} catch (err) {
		throw err;
	}
}

async function eliminar(tarea_id) {
	try {
		const borrados = await models.tareas.destroy({ where: { tarea_id } });
		return borrados;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	crear,
	listarPorUsuario,
	obtenerPorId,
	actualizar,
	eliminar,
	listarDias,
	sequelize,
	models
};


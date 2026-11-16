import mongoose from 'mongoose';

const adjuntoSchema = new mongoose.Schema(
  {
    nombre: String, // nombre original del archivo
    key: String, // nombre en disco o clave en S3
    mimetype: String,
    size: Number,
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [120, 'El título no puede superar los 120 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'La descripción no puede superar los 1000 caracteres'],
    },
    completado: { type: Boolean, default: false },
    adjunto: { type: adjuntoSchema, default: null },
  },
  {
    // fechaCreacion la genera Mongoose automáticamente
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export default mongoose.model('Task', taskSchema);

import mongoose from 'mongoose';

const populateReferences = (schema: mongoose.Schema) => {
  schema.pre('find', function () {
    this.populate('artists genres');
  });

  schema.pre('findOne', function () {
    this.populate('artists genres');
  });

  schema.pre('findById', function () {
    this.populate('artists genres');
  });
};

export default populateReferences;

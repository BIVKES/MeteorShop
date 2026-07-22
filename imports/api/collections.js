import { Mongo } from 'meteor/mongo';

export const MenuCollection = new Mongo.Collection('menu');
export const OfficeCartCollection = new Mongo.Collection('officeCart');
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';
import { DataStore } from '../interfaces/DataStore';
import { ByteType } from './types/byte.type';
import { getByte, getBytes, validateSection, completeByte } from '../interactors/byte.interactor';

export class ByteSchema {
  bytes;
  byte;
  validateSection;
  completeByte;

  constructor(private dataStore: DataStore) {
    this.byte = {
      type: ByteType,
      description: 'Resolves a byte by its unique identifier',
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return getByte(dataStore, args.id);
      }
    }

    this.bytes = {
      type: GraphQLList(ByteType),
      description: 'Resolves all bytes in the system',
      resolve(parentValue, args) {
        return getBytes(dataStore);
      }
    }

    this.validateSection = {
      type: GraphQLList(GraphQLBoolean),
      description: 'Checks whether or not the answers to a section\'s questions are correct',
      args: {
        byteId: { type: GraphQLString },
        sectionId: { type: GraphQLString },
        answers: { type: GraphQLList(GraphQLString) }
      },
      resolve(parentValue, args) {
        return validateSection({ dataStore, ...args });
      }
    }

    this.completeByte = {
      type: GraphQLBoolean,
      description: 'Returns the status of whether or not the byte was marked as completed',
      args: {
        byteId: { type: GraphQLString, description: 'The unique identifier of the byte' },
        userId: { type: GraphQLString, description: 'The unique identifier of the user' }
      },
      resolve(parentValue, args, context) {
        return completeByte(context.dataStore, args.byteId, args.userId);
      }
    }
  }
}
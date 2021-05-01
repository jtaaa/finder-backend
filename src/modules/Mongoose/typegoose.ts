import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';

import type { DocumentType } from '@typegoose/typegoose';
import type { ModelType } from '@typegoose/typegoose/lib/types';

/**
 * This class defines shared Mongoose model methods
 */
export class DBSchema {
  /**
   * Get a document from this model using an ObjectId specified by the user
   *   or throw an error if a matching doc can't be found
   * @param this Model<T>
   * @param id Id of the document requested
   * @param invalidArgs Error data to be included with UserInputError if doc not found
   */
  static async getFromUserInputId<T>(
    this: ModelType<T>,
    id: ObjectId,
    invalidArgs?: Record<string, unknown>,
  ): Promise<DocumentType<T>> {
    const doc = await this.findById(id);
    if (!doc) {
      throw new UserInputError(
        `No doc found in ${this.modelName} collection with id ${id}`,
        {
          invalidArgs: invalidArgs ?? { id },
        },
      );
    }

    return doc;
  }
}

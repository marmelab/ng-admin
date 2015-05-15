import Queries from './Queries'

class WriteQueries extends Queries {

    /**
     * Create a new entity
     * Post the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise}  the new object
     */
    createOne(view, rawEntity) {
        return this._restWrapper
            .createOne(rawEntity, view.entity.name(), this._application.getRouteFor(view));
    }

    /**
     * Update an entity
     * Put the data to the API to create the new object
     *
     * @param {View}   view             the formView related to the entity
     * @param {Object} rawEntity        the entity's object
     * @param {String} originEntityId   if entity identifier is modified
     *
     * @returns {promise} the updated object
     */
    updateOne(view, rawEntity, originEntityId) {
        let entityId = originEntityId || rawEntity[view.entity.identifier().name()];

        // Update element data
        return this._restWrapper
            .updateOne(rawEntity, view.entity.name(), this._application.getRouteFor(view, entityId));
    }

    /**
     * Delete an entity
     * Delete the data to the API
     *
     * @param {String} view     the formView related to the entity
     * @param {*}      entityId the entity's id
     *
     * @returns {promise}
     */
    deleteOne(view, entityId) {
        return this._restWrapper
            .deleteOne(view.entity.name(), this._application.getRouteFor(view, entityId));
    }

    /**
     * Delete a batch of entity
     * Delete the data to the API
     *
     * @param {String} view     the formView related to the entity
     * @param {*}      entityIds the entities ids
     *
     * @returns {promise}
     */
    batchDelete(view, entityIds) {
        var deleteOne = this.deleteOne.bind(this);

        var promises = entityIds.map(function (id) {
            return deleteOne(view, id);
        });

        return this._promisesResolver.allEvenFailed(promises);
    }
}

export default WriteQueries

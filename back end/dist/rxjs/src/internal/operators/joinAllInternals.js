"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinAllInternals = joinAllInternals;
const identity_1 = require("../util/identity");
const mapOneOrManyArgs_1 = require("../util/mapOneOrManyArgs");
const pipe_1 = require("../util/pipe");
const mergeMap_1 = require("./mergeMap");
const toArray_1 = require("./toArray");
/**
 * Collects all of the inner sources from source observable. Then, once the
 * source completes, joins the values using the given static.
 *
 * This is used for {@link combineLatestAll} and {@link zipAll} which both have the
 * same behavior of collecting all inner observables, then operating on them.
 *
 * @param joinFn The type of static join to apply to the sources collected
 * @param project The projection function to apply to the values, if any
 */
function joinAllInternals(joinFn, project) {
    return (0, pipe_1.pipe)(
    // Collect all inner sources into an array, and emit them when the
    // source completes.
    (0, toArray_1.toArray)(), 
    // Run the join function on the collected array of inner sources.
    (0, mergeMap_1.mergeMap)((sources) => joinFn(sources)), 
    // If a projection function was supplied, apply it to each result.
    project ? (0, mapOneOrManyArgs_1.mapOneOrManyArgs)(project) : identity_1.identity);
}

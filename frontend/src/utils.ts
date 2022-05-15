import {FieldStatus} from "./fileprocessing/constants";
import {createDeleteMapper, createErrorStateMapper, createUpdateMapper} from "./store/updatesReducer";

export const makeCopy = (s: any) => {
    if (s !== null && s !== undefined)
        return s
    else
        return undefined
}

export const plural = (x: any) => x > 1 ? 's' : '';
export const adj = (x: any) => x > 1 ? 'are' : 'is';
export const buildError = (props: any, field: string, status: FieldStatus) => ({
    file: props.file, id: props.id, dbId: props.dbId,
    error: {
        field, status
    },
});

export const buildUpdate = (props: any, field: string, value: string) => ({
    file: props.file, id: props.id, dbId: props.dbId,
    update: {
        field,
        value
    },
    initial: props.initial
});

export const deletedStyling = (deleted: boolean) => {
    return deleted ? {textDecoration: 'line-through'} : {}
}

export const deletedStylingClass = (deleted: boolean) => {
    return deleted ? "strike" : ""
}
export const buildStatePropMapper = (colName: string) => {
    return function mapStateToProps(state: any, ownProps: any) {
        return {
            updated: createUpdateMapper(state.updatesReducer, ownProps.file, ownProps.id, colName),
            error: createErrorStateMapper(state.updatesReducer, ownProps.file, ownProps.id, colName),
            deleted: createDeleteMapper(state.updatesReducer, ownProps.file, ownProps.id)
        }
    }
}

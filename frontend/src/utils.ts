import {columnNames, FieldStatus} from "./fileprocessing/constants";
import {createErrorStateMapper, createUpdateMapper} from "./store/updatesReducer";

export const makeCopy = (s: any) => {
    if (s !== null && s !== undefined)
        return s
    else
        return undefined
}

export const plural = (x: any) => x > 1 ? 's' : '';
export const buildError = (props: any, field: string, status: FieldStatus) => ({
    file: props.file, id: props.id,
    error: {
        field, status
    },
});

export const buildUpdate = (props: any, field: string, value: string) => ({
    file: props.file, id: props.id,
    update: {
        field,
        value
    },
    initial: props.initial
});

export const buildStatePropMapper = (colName: string) => {
    return function mapStateToProps(state: any, ownProps: any) {
        return {
            updated: createUpdateMapper(state.updatesReducer, ownProps.file, ownProps.id, colName),
            error: createErrorStateMapper(state.updatesReducer, ownProps.file, ownProps.id, colName),
        }
    }
}

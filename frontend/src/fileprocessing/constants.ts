export const columnNames = {
    NAME: 'name',
    AGE: 'age',
    SEX: 'sex'
}

export const COLUMNS = Object.values(columnNames);
export const MIN_WORKING_AGE = 18;
export const MAX_AGE = 130;
export const VALID_MALE_VALUES = ['male', 'm']
export const VALID_FEMALE_VALUES = ['female', 'f']
export const VALID_SEX_VALUES = VALID_FEMALE_VALUES.concat(VALID_MALE_VALUES);
export const VALIDATION_ERR_MESSAGE = {
    [columnNames.NAME]: 'name should be non-null',
    [columnNames.AGE]: `age should be integer and between ${MIN_WORKING_AGE} and ${MAX_AGE}`,
    [columnNames.SEX]: `sex should be one of {${VALID_SEX_VALUES}}`
}

export enum Sex {
    MALE = 'm',
    FEMALE = 'f',
    NULL = '',
}

export enum FieldStatus {
    EMPTY = 1,
    ERROR,
    WARNING
}

export type DataField = {
    value: string,
    status?: FieldStatus,
    message?: string
}

export type NameField = DataField;
export type AgeField = DataField & {
    value: number
};
export type SexField = DataField & {
    value: Sex
};
export type Person = {
    id: string,
    name: NameField,
    age: AgeField,
    sex: SexField,
    file: string,
    dbId?: number,
    stale?: boolean,
    error?: boolean,
}
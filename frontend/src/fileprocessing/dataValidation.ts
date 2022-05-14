import {
    columnNames,
    FieldStatus,
    MIN_WORKING_AGE,
    Person,
    Sex,
    VALID_FEMALE_VALUES,
    VALID_MALE_VALUES,
    VALID_SEX_VALUES
} from "./constants";

const validHeaders = new Set<string>(Object.values(columnNames))

function uid() {
    return (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, "");
};

const headersAreValid = (headerRow: string[]): boolean => {
    if (headerRow.length !== validHeaders.size)
        return false
    const headerSet = new Set<string>(headerRow);

    let valid = true;
    validHeaders.forEach((value => {
        valid = valid && headerSet.has(value)
    }))
    return valid;
}

class InvalidHeadersError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, InvalidHeadersError.prototype);
    }
}

type ColIndex = { [field: string]: number };


type ValidationMeta = {
    valid: boolean,
    error?: Error,
    data?: Person[]
}


const createHeaderMapping = (headers: any[]): ColIndex => {
    const mapping: ColIndex = {};
    headers.forEach((val, i) => {
        mapping[val] = i
    })

    const headerMapping: ColIndex = {}
    Object.values(columnNames).forEach((colName) => {
        headerMapping[colName] = mapping[colName]
    })

    return headerMapping
}

const isValidAge = (str: any) => {
    if (typeof str !== 'string' ) {
        return false;
    }
    const num = Number(str);
    if (Number.isInteger(num) && num >= MIN_WORKING_AGE) {
        return true;
    }
    return false;
}

const isValidSex = (str: any) => {
    if (typeof str !== 'string') {
        return false;
    }
    return VALID_SEX_VALUES.includes(str.toLowerCase())
}

export const isFieldValid = {
    [columnNames.NAME]: (name: any) => name && typeof name === "string" && name.length > 0,
    [columnNames.AGE]: (age: any) => age && isValidAge(age),
    [columnNames.SEX]: (age: any) => age && isValidSex(age),
}

const formatField = {
    [columnNames.NAME]: (name: any) => name,
    [columnNames.AGE]: (age: any) => Number(age),
    [columnNames.SEX]: (sex: any) => {
        sex = sex.toLowerCase()
        if (VALID_FEMALE_VALUES.includes(sex))
            return Sex.FEMALE
        if (VALID_MALE_VALUES.includes(sex))
            return Sex.MALE
        return Sex.NULL
    },
}

class PersonBuilder {
    private person: Person | null;
    private values: any;
    private emptyFields: number;


    constructor() {
        this.person = null;
        this.values = {}
        this.emptyFields = 0;
    }

    public addField(colName: string, value: any) {
        if (!value) {
            this.values[colName] = {
                value: null,
                status: FieldStatus.EMPTY
            }
            this.emptyFields += 1;
        } else if (isFieldValid[colName](value)) {
            this.values[colName] = {
                value: formatField[colName](value)
            }
        } else {
            this.values[colName] = {
                value: value,
                status: FieldStatus.ERROR
            }
        }
    }

    public build(): Person | null {
        if (validHeaders.size === this.emptyFields)
            return null;

        return {
            id: uid(),
            name: this.values.name,
            age: this.values.age,
            sex: this.values.sex,
            file: ''
        }
    }
}

const buildPerson = (row: any[], mapping: ColIndex): Person | null => {
    const personBuilder = new PersonBuilder();
    Object.values(columnNames).forEach((colName) => {
        personBuilder.addField(colName, row[mapping[colName]])
    })
    return personBuilder.build();
}

export const validateData = (csv: [any[]], file: File): ValidationMeta => {
    const headers = csv[0].map(header => header.toLowerCase());
    if (!headersAreValid(headers)) {
        return {
            valid: false,
            error: new InvalidHeadersError(`expected column names to be ${validHeaders}, got ${csv[0]}, matches are [case-insensitive] [order-insensitive]`),
        }
    }
    const data = csv.slice(1);
    const headerMapping = createHeaderMapping(headers)
    const personData: Person[] = []

    data.forEach((row: any[]) => {
        const person = buildPerson(row, headerMapping);
        if (person) {
            person.file = file.name;
            personData.push(person)
        }
    })

    return {
        valid: true,
        data: personData,
    }
}
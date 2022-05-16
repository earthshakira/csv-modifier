from random import randint

with open('/Users/shubham-smallcase/Downloads/name_gender.csv') as f:
    x = f.readlines()
    newCsv = "Name,Age,Sex\n"
    for row in x[1:]:
        crow = row[:-1].split(',')
        crow.pop()
        crow.append(str(randint(21, 75)))
        newCsv += ",".join(crow)
        newCsv += "\n"

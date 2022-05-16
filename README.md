# EDM: Employee Data Modifier

[Live Link](https://csv-update-pipeline.herokuapp.com/) [Dummy Data](https://github.com/earthshakira/csv-modifier/tree/main/dummy_data)

## Features

![Preview Photo](https://i.imgur.com/jpEfwvk.png)

### 1. Multi File Edits

A tab based view gives you the option to open multiple files, freshly added or previously uploaded.

### 2. Update Summary

On the bottom right you the view of what's going on in your files and how many changes are pending upload.

### 3. Tooltips and Hints

The interface has rich hints on the status of each individual file and what all changes are pending.

#### 4. Progress Bars

All upload/download tasks have their own progress bars and can show a realtime status of your operation.

### 5. Deletes and Restores

All Deletes made in session are not removed till you upload the file allowing you to restore accidentally deleted rows.

## Choices

### 1. Papa Parser React

It is a CSV upload and parsing library with good UI and code snippets making CSV Uploads good-looking and functional.

### 2. Redux + Redux Toolkit

State management along with slices, which helps de-clutter store and manage states for multiple components. 

### 3. Django + DRF

Django was used as it provides it's own ORM along with DRF which builds on it to making it quick to develop APIs

### 4. Postgresql 

It supports bulk record creation and is also available as hobby tier on heroku

## Improvements

#### 1. Live Changes
Using a more active communication like websockets and a debouncing logic to add changes to the server very fast

#### 2. Concurrent Edits
Have concurrency control when multiple people start editing the same file.

#### 3. Smooth UI/UX
There are some states with poor error management and can be improved to give the user a more smooth and effortless experience. 



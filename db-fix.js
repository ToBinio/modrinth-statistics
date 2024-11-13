const dateSuffix1 = '2024-11-11';
const dateSuffix2 = '2024-11-13';
const targetDateSuffix = '2024-11-12';

const data1 = db.projectStatistics.find({ key: new RegExp(dateSuffix1 + '$') }).toArray();
const data2 = db.projectStatistics.find({ key: new RegExp(dateSuffix2 + '$') }).toArray();

for (let i = 0; i < data1.length; i++) {
    const entry1 = data1[i];
    const entry2 = data2[i];

    if (entry1 && entry2) {
        // Parse the data strings to work with numbers
        const data1 = JSON.parse(entry1.value);
        const data2 = JSON.parse(entry2.value);

        for (let j = 0; j < data1.data.length; j++) {
            const value1 = data1.data[j]
            const value2 = data2.data[j]

            for (let k = 0; k < value1.values.length; k++) {
                const something1 = value1.values[k]
                const something2 = value2.values[k]

                something2.downloads = Math.round((something1.downloads + something2.downloads) / 2)
                something2.versions = Math.round((something1.versions + something2.versions) / 2)
                something2.count = Math.round((something1.count + something2.count) / 2)
            }
        }

        // Clone entry2 and update its key and value with interpolated data
        const newEntry = { ...entry2 };
        newEntry.key = newEntry.key.replace(dateSuffix2, targetDateSuffix);
        newEntry.value = JSON.stringify(data2);
        delete newEntry._id;

        // Insert the new interpolated entry
        db.projectStatistics.insertOne(newEntry);
        print(`Inserted interpolated entry for ${newEntry.key} ${JSON.stringify(newEntry)}`);
    } else {
        print("One or both required entries for interpolation are missing.");
    }
}

const data1 = db.globalStatistics.find({ key: new RegExp(dateSuffix1 + '$') }).toArray();
const data2 = db.globalStatistics.find({ key: new RegExp(dateSuffix2 + '$') }).toArray();

for (let i = 0; i < data1.length; i++) {
    const entry1 = data1[i];
    const entry2 = data2[i];

    if (entry1 && entry2) {
        // Parse the data strings to work with numbers
        const data1 = JSON.parse(entry1.value);
        const data2 = JSON.parse(entry2.value);

        // Interpolate the values
        const interpolatedData = {
            projects: Math.round((data1.projects + data2.projects) / 2),
            versions: Math.round((data1.versions + data2.versions) / 2),
            authors: Math.round((data1.authors + data2.authors) / 2),
            files: Math.round((data1.files + data2.files) / 2)
        };

        // Clone entry2 and update its key and value with interpolated data
        const newEntry = { ...entry2 };
        newEntry.key = newEntry.key.replace(dateSuffix2, targetDateSuffix);
        newEntry.value = JSON.stringify(interpolatedData);
        delete newEntry._id;

        // Insert the new interpolated entry
        db.globalStatistics.insertOne(newEntry);
        print(`Inserted interpolated entry for ${targetDateSuffix}`);
    } else {
        print("One or both required entries for interpolation are missing.");
    }
}
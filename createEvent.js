const Component = require("immutable-ics").Component;
const Property = require("immutable-ics").Property;
const fs = require("fs");

function createFileName(eventName, startTime) {
  eventName = eventName.toLowerCase();
  var eventName = eventName.split(" ");

  eventName = eventName.map(input => {
    word = input.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    console.log(word);
    return word;
  });

  eventName = eventName.join("");
  startTime = startTime.toLocaleString().replace(/,/g, "_");
  startTime = startTime.replace(/\s/g, "");
  startTime = startTime.replace(/:/g, "_");
  startTime = startTime.replace(/\//g, "_");
  console.log(startTime);
  fileName = eventName.concat(`_${startTime}`);
  return fileName.concat(".ics");
}

function createEvent(eventName, startTime, endTime, filePath) {
  const calendar = new Component({
    name: "VCALENDAR",
    properties: [new Property({ name: "VERSION", value: 2 })],
    components: [
      new Component({
        name: "VEVENT",
        properties: [
          new Property({
            name: "DTSTART",
            parameters: { VALUE: "DATE-TIME" },
            value: startTime
          }),
          new Property({
            name: "DTEND",
            parameters: { VALUE: "DATE-TIME" },
            value: endTime
          }),
          new Property({
            name: "SUMMARY",
            value: eventName
          })
        ]
      })
    ]
  });

  console.log(`${filePath}/${createFileName(eventName, startTime)}`);

  fs.writeFile(
    `${filePath}/${createFileName(eventName, startTime)}`,
    calendar.toString(),
    err => {
      if (err) {
        console.error(err);
      }
    }
  );
}

module.exports.createEvent = createEvent;

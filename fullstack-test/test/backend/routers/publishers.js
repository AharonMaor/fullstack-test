import express from "express";
import { publishers } from "../server.js";
import fs from "fs";

const publishersRouter = express.Router();

// Function to save data to db.json
//The db.json file will be updated every time there are changes to the publishers (POST OR DELETE)
const savePublishersToFile = () => {
  fs.writeFileSync("./db.json", JSON.stringify(publishers, null, 2), "utf8");
};

publishersRouter.get("/", (req, res) => {
  res.status(200).json(publishers);
});

publishersRouter.post("/", (req, res) => {
  const publisherName = req.body.publisher;
  const publisher = publishers.find(
    (existsPublisher) =>
      existsPublisher.publisher.toLowerCase() === publisherName.toLowerCase()
  );

  if (publisher) {
    return res.status(400).json({ errorMessage: "The publisher already exists" });
  }

  const newPublisher = {
    publisher: publisherName,
    domains: [],
  };

  publishers.unshift(newPublisher);
  

  // Save the updated publishers list to the file
  savePublishersToFile();

  res.status(200).json(newPublisher);
});

publishersRouter.delete("/:publisherName", (req, res) => {
  const publisherName = req.params.publisherName.toLowerCase();
  const publisherIndex = publishers.findIndex(
    (existsPublisher) => existsPublisher.publisher.toLowerCase() === publisherName
  );

  if (publisherIndex !== -1) {
    const [deletedPublisher] = publishers.splice(publisherIndex, 1);
    
    // Save the updated publishers list to the file
    savePublishersToFile();

    return res.status(201).json(deletedPublisher);
  } else {
    return res.status(400).json({ errorMessage: "Publisher not found" });
  }
});

export default publishersRouter;

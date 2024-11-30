const Detailsdata = require("../models/detailsmodel");


module.exports.handlepostdetails = async function (req, res) {
  const { name, details, location, contact, problemstatemet,Strong } = req.body;
  const img = req.file ? req.file.filename : null;

  try {
    const data = await Detailsdata.create({
      name: name,
      details: details,
      location: location,
      contact: contact,
      img: img,
      problemstatemet: problemstatemet,
      Strong: Strong,
    });
    res.redirect("/profiledata");
  } catch (error) {
    console.error("Error creating details:", error);
    res.status(404).send({ error: error.message });
  }
};


// const bcrypt = require('bcrypt');

// module.exports.handlepostdetails = async function (req, res) {
//   const { name, details, location, contact, problemstatemet, Strong } = req.body;
//   const img = req.file ? req.file.filename : null;

//   try {
//     // Hash the contact information using bcrypt
//     const hashedContact = await bcrypt.hash(contact, 10); // 10 is the saltRounds

//     // If you also want to hash the 'Strong' field, you can hash it similarly
//     const hashedStrong = await bcrypt.hash(Strong, 10);

//     const data = await Detailsdata.create({
//       name: name,
//       details: details,
//       location: location,
//       contact: hashedContact, // Save hashed contact
//       img: img,
//       problemstatemet: problemstatemet,
//       Strong: hashedStrong, // Save hashed Strong
//     });

//     res.redirect("/profiledata");
//   } catch (error) {
//     console.error("Error creating details:", error);
//     res.status(404).send({ error: error.message });
//   }
// };


module.exports.handleprofilepage = async function (req, res) {
    try {
      const data = await Detailsdata.find({});
      res.render("profiledetails", { data });
    } catch (error) {
      console.error("Error rendering profile page:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
module.exports.getProblemDetails = async function (req, res) {
    try {
        const id = req.params.id; // Get the ID from the URL
        const problemData = await Detailsdata.findById(id); // Find the specific problem statement by ID
        if (!problemData) {
            return res.status(404).send("Problem Statement not found");
        }
        res.render("problemdetails", { item: problemData }); // Render the problem details page
    } catch (error) {
        console.error("Error fetching problem details:", error);
        res.status(500).send("Internal Server Error");
    }
};
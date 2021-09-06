const Sauce = require("../models/sauce");
const fs = require("fs");

// Récupère toutes les sauces
exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Créer une sauce
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupère une seule sauce
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// Modifie une sauce
exports.modifySauce = (req, res) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) res.status(400).json({ error });
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject })
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprime une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// J'aime / j'aime pas une sauce
exports.likeSauce = (req, res) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      let sauceUpdate = {};
      let msgUpdate = "";
      switch(like){
        case 0:
          if (sauce.usersLiked.includes(userId)) {
            sauceUpdate = {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              },
            };
            msgUpdate = "J'aime supprimé";
          }else if(sauce.usersDisliked.includes(userId)){
            sauceUpdate = {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              },
            };
            msgUpdate = "J'aime pas supprimé";
          }
          break;
        case 1:
          if (!sauce.usersLiked.includes(userId)) {
            sauceUpdate = {
              $push: {
                usersLiked: userId,
              },
              $inc: {
                likes: +1,
              },
            };
            msgUpdate = "J'aime ajouté";
          }
          break;
        case -1:
          if (!sauce.usersDisliked.includes(userId)){
            sauceUpdate = {
              $push: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: +1,
              },
            };
            msgUpdate = "J'aime pas ajouté";
          }
          break;
      }
      Sauce.updateOne(
        { _id: sauceId },
        sauceUpdate
      )
        .then(() => res.status(200).json({ message: msgUpdate }))
        .catch((error) => res.status(400).json({ error }));

  }).catch((error) => res.status(400).json({ error }));
}
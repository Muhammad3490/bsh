const Users = require("../Models/User");
const Links = require("../Models/Link");
const Theme = require("../Models/Theme");
const SelectedTheme = require("../Models/SelectedTheme");

const getPage = async (req, res) => {
  console.log("Worked");
  const { userName } = req.params;
  console.log("userName:", userName);

  try {
    const findUser = await Users.findOne({ userName: userName });
    console.log("User:", findUser);
    if (!findUser) {
      return res.render("Pages/Error", {
        userName: userName,
        title: "User not found!!",
      });
    }

    const links = await Links.find({ ownerId: findUser._id });
    const themeId = await SelectedTheme.findOne({ userId: findUser._id });
    const theme = await Theme.findById(themeId.themeId);
    console.log("Theme:", theme);

    if (links) {
      return res.render("Pages/userPage", {
        links: links,
        theme: theme,
        user: findUser,
      });
    } else {
      return res.json({ status: "failed", error: "Unable to find data" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.json({ status: "failed", error: error.message });
  }
};

module.exports = { getPage };

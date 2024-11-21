
const accessGranted = (req, res, next) => {
  const serverId = req.params.id;
  
  // Check if the user has the cookie indicating they have confirmed the password
  const accessGranted = req.cookies[`access_granted_${serverId}`];

  if (!accessGranted) {
    // If the cookie is not present, redirect to password confirmation page
    return res.redirect("/server/"+serverId+"/access-confirmationMDP");
  }

  // If the cookie is present, allow access to the next route
  return next();
};
module.exports = accessGranted;
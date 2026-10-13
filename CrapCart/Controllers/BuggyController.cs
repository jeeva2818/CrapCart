using Microsoft.AspNetCore.Mvc;

namespace CrapCart.Controllers;

public class BuggyController : BaseApiController
{
[HttpGet("notfound")]
public ActionResult GetNotFound()
    {
        return NotFound();
    }

[HttpGet("badrequest")]
public ActionResult GetBadRequest()
{
    return BadRequest("This is not a good request");
}

[HttpGet("unauthorized")]
public ActionResult GetUnauthorized()
{
    return Unauthorized();
}
[HttpGet("validationerror")]
public ActionResult GetValidationError()
{
    ModelState.AddModelError("problem1", "this is the first error");
    ModelState.AddModelError("problem2", "this is the second error");

    return ValidationProblem();
}
[HttpGet("servererror")]
public ActionResult GetServerError()
{
    throw new Exception("This is a server error");
}
}
const { Router, json } = require("express");
const adminMiddleware = require("../middleware/admin");
const { AdminValidation, CourseValidation } = require("../validations")
const router = Router();

const { Admin, Course } = require("../db");


router.use(json())
// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const isValid = AdminValidation.safeParse({
        username: req.body.username,
        password: req.body.password
    })
    if ( !isValid.success ) {
        res.status(400).json(isValid.error.format());
        return;
    }
    const User = new Admin({
        username: req.body.username,
        password: req.body.password,
    })
    await User.save();
    res.status(201).json({username: User.username})

});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    
    const isCourseValid = CourseValidation.safeParse({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink
    })
    
    if( !isCourseValid.success ) {
        res.status(400).json(isCourseValid.error.format());
        return
    }

    const course = new Course({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink
    });
    await course.save();
    res.status(201).json(course);

    
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    try {
        const courses = await Course.find({});
        if( courses ) {
            res.status(200).json({courses})
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
const z = require('zod');
const AdminValidation = z.object( {
    username: z.string().min(1),
    password: z.string().min(5)
}
)
const CourseValidation = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number().min(1),
    imageLink: z.string().url()
})

module.exports = { AdminValidation, CourseValidation };
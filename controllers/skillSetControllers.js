
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body

    let skill = await prisma.skillSet.findMany({
      where: { name }
    })

    if (skill.length > 0) {
      return res.status(201).send(skill[0])
    }

    skill = await prisma.skillSet.create({
      data: { name }
    })
    res.status(201).send(skill)

  } catch (error) {
    next(error)
  }

}

const getSkills = async (req, res, next) => {
  try {
    const skills = await prisma.skillSet.findMany({
      select: {
        name: true
      }
    })
    return res.status(200).json(skills)
  } catch (error) {
    next(error)
  }
}


const deleteSkill = async (req, res, next) => {
  try {
    const { name } = req.params;

    let skill = await prisma.skillSet.findMany({
      where: { name }
    })

    if (skill.length === 0) {
      return res.status(201).json({ name })
    }

    skill = await prisma.skillSet.deleteMany({
      where: { name }
    })
    res.status(201).send(skill)

  } catch (error) {
    next(error)
  }

}

module.exports = {
  createSkill,
  deleteSkill,
  getSkills,
}
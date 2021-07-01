import path from 'path'
import chalk from 'chalk'
import fs from 'fs'

const createTemplate = (req, res, emailTemplatesDir, log) => {

  const successTemplate = fs.readFileSync(`${__dirname}/templates/create-template-success.xml`, { encoding: 'utf-8' })

  log(`  ${chalk.green('Create 📬 Template')}`)

  const template = {
    TemplateName: req.body['Template.TemplateName'],
    SubjectPart: req.body['Template.SubjectPart'],
    TextPart: req.body['Template.TextPart'],
    HtmlPart: req.body['Template.HtmlPart'],
  }

  const templatePath = path.join(emailTemplatesDir, `${template.TemplateName}Template.json`)

  fs.writeFile(templatePath, JSON.stringify(template), (err) => {
    if (err) {
      throw err
    }
    log(`Created Template: ${template.TemplateName}`)
  })

  res.status(200).send(
    successTemplate
  )
}

export default createTemplate

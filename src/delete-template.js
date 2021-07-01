import path from 'path'
import chalk from 'chalk'
import fs from 'fs'

const deleteTemplate = (req, res, emailTemplatesDir, log) => {
  const successTemplate = fs.readFileSync(`${__dirname}/templates/delete-template-success.xml`, { encoding: 'utf-8' })

  log(`  ${chalk.green('Delete 📬 Template')}`)

  const templateName = req.body['TemplateName']

  const templatePath = path.join(emailTemplatesDir, `${templateName}Template.json`)

  fs.unlink(templatePath, (err) => {
    if (err) {
      throw err
    }

    log(`Deleted Template: ${templateName}`)
  })

  res.status(200).send(
    successTemplate
  )
}

export default deleteTemplate

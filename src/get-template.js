import path from 'path'
import chalk from 'chalk'
import fs from 'fs'

const getTemplate = (req, res, emailTemplatesDir, log) => {

  let successTemplate = fs.readFileSync(`${__dirname}/templates/get-template-success.xml`, { encoding: 'utf-8' })
  let itemTemplate = '<Template><TemplateName>{{TemplateName}}</TemplateName><SubjectPart>{{SubjectPart}}</SubjectPart><TextPart>{{TextPart}}</TextPart>{{HtmlPart}}<HtmlPart></HtmlPart></Template>'

  log(`  ${chalk.green('Get 📬 Template')}`)

  const templateName = req.body['TemplateName']

  const templatePath = path.join(emailTemplatesDir, `${templateName}Template.json`)

  const template = JSON.parse(fs.readFileSync(templatePath).toString())

  itemTemplate = itemTemplate.replace('{{TemplateName}})', template.TemplateName)
                             .replace('{{SubjectPart}})', template.SubjectPart)
                             .replace('{{TextPart}}', template.TextPart)
                             .replace('{{HtmlPart}}', template.HtmlPart)

  successTemplate = successTemplate.replace('{{Template}}', itemTemplate)

  res.status(200).send(
    successTemplate
  )
}

export default getTemplate

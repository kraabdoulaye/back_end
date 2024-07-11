const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const moduleName = process.argv[2];

// Validation du nom du module
if (!moduleName) {
  console.error('Veuillez fournir un nom de module.');
  process.exit(1);
}

if (!/^[a-zA-Z0-9_]+$/.test(moduleName)) {
  console.error('Le nom du module doit être alphanumérique.');
  process.exit(1);
}

const baseDir = process.cwd(); // Répertoire courant du terminal
const templatesDir = path.join(baseDir, 'src/core/scripts/templates'); // Répertoire contenant les fichiers de templates

async function generateFile(templatePath, outputPath, data) {
  try {
    if (await fs.access(outputPath).then(() => true).catch(() => false)) {
      console.error(`Le fichier pour le module ${data.moduleName} existe déjà : ${outputPath}`);
      process.exit(1);
    }
    
    const template = await fs.readFile(templatePath, 'utf8');
    const content = ejs.render(template, data);
    
    await fs.writeFile(outputPath, content);
  } catch (err) {
    console.error(`Erreur lors de la création du fichier : ${outputPath}`);
    console.error(err);
    process.exit(1);
  }
}

async function updateIndexFile(indexPath, moduleName, suffix) {
  try {
    if (!(await fs.access(indexPath).then(() => true).catch(() => false))) return;
  
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const updatedIndexContent = indexPath.includes('routes') ?
      indexContent.replace('// Import des routes', `import ${moduleName}Route from './${moduleName}.${suffix}';\n$&`)
                  .replace('// Enregistrement des routes', `$&\n  fastify.register(${moduleName}Route, { prefix: '/${moduleName.toLowerCase()}s' });`) :
      indexContent.replace('// Import des contrôleurs', `export {default as ${moduleName}Controller} from './${moduleName}.${suffix}';\n$&`);
  
    await fs.writeFile(indexPath, updatedIndexContent);
  } catch (err) {
    console.error(`Erreur lors de la mise à jour du fichier : ${indexPath}`);
    console.error(err);
    process.exit(1);
  }
}

async function main() {
  await generateFile(path.join(templatesDir, 'controller.ejs'), path.join(baseDir, 'src', 'controllers', `${moduleName}.cnt.ts`), { moduleName });
  await generateFile(path.join(templatesDir, 'model.ejs'), path.join(baseDir, 'src', 'models', `${moduleName}.model.ts`), { moduleName });
  await generateFile(path.join(templatesDir, 'route.ejs'), path.join(baseDir, 'src', 'routes', `${moduleName}.route.ts`), { moduleName });

  await updateIndexFile(path.join(baseDir, 'src', 'routes', 'index.ts'), moduleName, 'route');
  await updateIndexFile(path.join(baseDir, 'src', 'controllers', 'index.ts'), moduleName, 'cnt');

  console.log(`Le module ${moduleName} a été créé avec succès.`);
  console.log(`Veuillez vous rendre dans les répertoires suivants pour effectuer les modifications nécessaires :`);
  console.log(`- Controllers : /src/controllers`);
  console.log(`- Models : /src/models`);
  console.log(`- Routes : /src/routes`);
}

main();

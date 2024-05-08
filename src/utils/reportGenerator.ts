import fs from 'fs'
import carbone from 'carbone'

export async function generateReport(templatePath: string, filePath: string, data: any) {
  return new Promise((resolve, reject) => {
    carbone.render(templatePath, data, function(err, result){
      if (err) {
        console.log(err);
        reject(err)
      }
      
      fs.writeFileSync(filePath, Buffer.from(result));
      resolve(null)
    });
  })
}
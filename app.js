var excelToJson = require('convert-excel-to-json');
var fs = require('fs');
var fse = require('fs-extra');
var copy = require('copy-files');
var ncp = require('ncp').ncp;
var pajaro = require('bluebird')

// var dir = 'C:/Users/desarrollo01/test_heydi/test'
// RUTA A DONDE SE VA A COPIAR
var dir = 'F:/masiva_robot_buena'

// RUTA DONDE ESTAN LOS ARCHIVOS
var concentrado = 'F:/'




  var hoja = process.argv.slice(2)[0]

  leerExcel(hoja)
  .then(function(res){
    if (!res.err) {
      var arr = res
      console.log(arr)
      /*crearExpedientes(arr)
      .then(function(res){*/

        crearCarpetas(arr)
        .then(function(res){

          // console.log(res);
          copiarArchivos(arr)
          .then(function(res){
            console.log(res,'<-------- RES');
          })
        })

      //})

    } else {
      console.log(res);
    }

  })


function crearExpedientes(arr) {
  return new Promise(function(resolve, reject){

    for (var key in arr) {

      if (arr[key].expedientes != undefined) {

        if (!fs.existsSync(`${dir}/${arr[key].expedientes}`)){

          fs.mkdirSync(`${dir}/${arr[key].expedientes}`);

        } else {
          console.log(`Ya existe el expediente ${arr[key].expedientes}`);
        }

      }

    }

    resolve({ err: false, description: "Se crearon las carpetas" })

  })
}


function leerExcel(hoja) {
  return new Promise(function(resolve, reject) {
    var arr = []

    var result = excelToJson({
        sourceFile: 'layout_final_hn.xlsx',
        columnToKey: {
            A: 'credito',
            B: 'archivos',
            C: 'ruta_dictamen_4',
            D: 'ruta_dictamen_5'
            // E: 'ruta_control_juridico',
            // F: 'ruta_dictamen_1',
            // G: 'ruta_dictamen_2',
            // H: 'ruta_dictamen_3',
            // I: 'ruta_avaluo_03',
            // J: 'ruta_inicial',
            // K: 'expedientes'
        }
    });

    var arr = result[hoja]

    // validarLayout(arr[0])
    // .then(function(res){
    //   if (!res.err) {
    arr = arr.slice(1)
    resolve(arr)
    //   } else {
    //     resolve({ err: true, descripcion: res.descripcion })
    //   }
    // })

  });
}


function crearCarpetas(arr) {
  return new Promise(function(resolve, reject) {


    for (var key in arr) {

      console.log('AQUIII ')

      if (!fs.existsSync(`${dir}/${arr[key].archivos}/${arr[key].credito}`)){

        console.log(`${dir}/${arr[key].archivos}/${arr[key].credito}`)

        fs.mkdirSync(`${dir}/${arr[key].archivos}/${arr[key].credito}`);

      } else {
        console.log(`Ya existe carpeta ${arr[key].credito}`);
      }
    }

    //process.exit()

    resolve({ err: false, description: "Se crearon las carpetas" })

  });
}

function copiarArchivos(arr) {
  return new Promise(async function(resolve, reject) {
    /*copiarArchivosGenerales(arr)
    .then(function(res){
      resolve(res)
    })*/

    // let aw = await copiarArchivosGenerales(arr)

    let aw1 = await copiarDictamen(arr)

    let aw2 = await copiarAvaluo(arr)

    let aw3 = await copiarDictamen1(arr)

    let aw4 = await copiarDictamen2(arr)

    let aw5 = await copiarDictamen3(arr)

    let aw6 = await copiarControlJuridico(arr)

    let aw7 = await copiarAvaluo03(arr)

    resolve({ err: false, description: 'Se copiaron los archivos' })


  });
}

function copiarArchivosGenerales(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} archivos generales`)
        //console.log(`${arr.ruta_inicial}${arr.archivos}`, 'carpeta')
        if (fs.existsSync(`${concentrado}/${arr.ruta_inicial}${arr.archivos}`)) {

          var archivos = fs.readdirSync(`${concentrado}/${arr.ruta_inicial}${arr.archivos}`)
          var files = {}

          var destination = `${dir}/${arr.archivos}/${arr.credito}`

          pajaro.each(archivos, function(item){
            return new Promise(function(resolve, reject){
              var ruta = `${concentrado}/${arr.ruta_inicial}${arr.archivos}/${item}`
              var rutaFinal = destination + '/' + item
              //console.log('credito', ruta)
              copiarArchivo(ruta, rutaFinal)
              .then(function(res){
                resolve()
              })
            })
          }).then(function(){
            resolve()
          })

        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar archivos generales' })
    })


  })
}

function copiarArchivo(ruta, rutaFinal) {
  return new Promise(function(resolve, reject){
    fs.copyFile(ruta, rutaFinal, (err) => {
      if (err) {
        console.log(err,'errrrrrrrrrrrr')
        resolve()
      } else {
        resolve({res: false});
      }
    });
  })
}

function copiarDictamen(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} dictamen`)
        var dictamen = `${concentrado}/${arr.ruta_dictamen_4}/${arr.credito}.pdf`
        var dictamen_archivo = `${arr.credito}_DICTAMENES_VIVIENDA_01821_4_250719.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(dictamen)) {
          var ruta = dictamen
          var rutaFinal = destination + '/' + dictamen_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar dictamen' })
    })

  })
}

function copiarAvaluo(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} avaluo`)
        var avaluo = `${concentrado}/${arr.ruta_avaluo}/${arr.credito}.pdf`
        var avaluo_archivo = `${arr.credito}_avaluo.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(avaluo)) {
          var ruta = avaluo
          var rutaFinal = destination + '/' + avaluo_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar avaluo' })
    })

  })
}

function copiarControlJuridico(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} control juridico`)
        var control_juridico = `${concentrado}/${arr.ruta_control_juridico}/${arr.credito}.pdf`
        var control_juridico_archivo = `${arr.credito}_control_juridico.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(control_juridico)) {
          var ruta = control_juridico
          var rutaFinal = destination + '/' + control_juridico_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar control juridico' })
    })

  })
}

function copiarDictamen1(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} dictamen 1`)
        var copia_dictamen_1 = `${concentrado}/${arr.ruta_dictamen_1}/${arr.credito}.pdf`
        var copia_dictamen_1_archivo = `${arr.credito}_copia_dictamen_1.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(copia_dictamen_1)) {
          var ruta = copia_dictamen_1
          var rutaFinal = destination + '/' + copia_dictamen_1_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar dictamen 1' })
    })

  })
}

function copiarDictamen2(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} dictamen 2`)
        var copia_dictamen_2 = `${concentrado}/${arr.ruta_dictamen_2}/${arr.credito}.pdf`
        var copia_dictamen_2_archivo = `${arr.credito}_copia_dictamen_2.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(copia_dictamen_2)) {
          var ruta = copia_dictamen_2
          var rutaFinal = destination + '/' + copia_dictamen_2_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar dictamen 2' })
    })

  })
}

function copiarDictamen3(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} dictamen 3`)
        var copia_dictamen_3 = `${concentrado}/${arr.ruta_dictamen_3}/${arr.credito}.pdf`
        var copia_dictamen_3_archivo = `${arr.credito}_copia_dictamen_3.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(copia_dictamen_3)) {
          var ruta = copia_dictamen_3
          var rutaFinal = destination + '/' + copia_dictamen_3_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar dictamen 3' })
    })

  })
}

function copiarAvaluo03(arr1) {
  return new Promise(function(resolve, reject){

    var array = arr1
    var total = arr1.length -1
    var conteo = 0

    pajaro.each(array, function(arr){
      return new Promise(function(resolve, reject){
        conteo++
        console.log(`${conteo} de ${total} avaluo 03`)
        var avaluo_03 = `${concentrado}/${arr.ruta_avaluo_03}/${arr.credito}_03.pdf`
        var avaluo_03_archivo = `${arr.credito}_avaluo_03.pdf`
        var destination = `${dir}/${arr.archivos}/${arr.credito}`

        if (fs.existsSync(avaluo_03)) {
          var ruta = avaluo_03
          var rutaFinal = destination + '/' + avaluo_03_archivo
          //console.log('credito', ruta)
          copiarArchivo(ruta, rutaFinal)
          .then(function(res){
            resolve()
          })
        } else {
          resolve()
        }
      })
    }).then(function(){
      resolve({ err: false, description: 'Termino copiar avaluo 03' })
    })

  })
}

// console.log('TERMINO')

//import express
const express = require("express")
const res = require("express/lib/response")
// const detail_transaksi = require("../models/detail_transaksi")

const app = express()
app.use(express.json())

//import model
const models = require("../models/index")
const Transaksi = models.transaksi
const Meja = models.meja
const User = models.user
const detail_transaksi = models.detail_transaksi
const auth = require("../auth")
const { mustLogin, mustBeKasirOrAdmin, mustBeKasirOrManager, mustBeAdmin,mustBeKasir } = require("../must")

app.get("/", auth, (req, res) => {
  Transaksi.findAll()
    .then(result => {
      res.json({
        data: result
      })
    })
    .catch(err => {
      res.json({
        msg: err.massage
      })
    })
})

app.get("/:id", auth, (req, res) => {
  let param = ({ id_transaksi: req.params.id })
  Transaksi.findOne({ where: param })
    .then(result => {
      res.json({
        data: result
      })
    })
    .catch(err => {
      res.json({
        msg: err.massage
      })
    })
})

app.get("/filter/nama_user/:nama_user", auth, mustLogin, mustBeKasirOrManager, async (req, res) => {
  // endpoint untuk mencari data transaksi berdasarkan nama user
  const param = { nama_user: req.params.nama_user }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  User.findAll({
    // mengambil data user berdasarkan nama user yang dikirimkan melalui parameter
    where: {
      nama_user: param.nama_user,
    },
  })
    .then((result) => {
      // jika berhasil
      if (result == null) {
        // jika data tidak ditemukan
        res.status(404).json({
          // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        Transaksi.findAll({
          // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
          where: {
            id_user: result[0].id_user,
          },
          include: [
            {
              model: models.detail_transaksi,
              as: "detail_transaksi",
              include: ["menu"]
            }
          ]
        })
          .then((result) => {
            // jika berhasil
            if (result.length === 0) {
              // jika data tidak ditemukan
              res.status(404).json({
                // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
                status: "error",
                message: "data tidak ditemukan",
              });
            } else {
              // jika data ditemukan
              res.status(200).json({
                // mengembalikan response dengan status code 200 dan pesan data ditemukan
                status: "success",
                message: "data ditemukan",
                data: result,
              });
            }
          })
          .catch((error) => {
            // jika gagal
            res.status(400).json({
              // mengembalikan response dengan status code 400 dan pesan error
              status: "error",
              message: error.message,
            });
          });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

app.post("/", auth, mustLogin, mustBeKasir, async (req, res) => {
  let current = new Date().toISOString().split('T')[0]
  let data = {
    id_user: req.body.id_user,
    tgl_transaksi: current,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: "belum_bayar"
  }
  Transaksi.create(data)
    .then(result => {
      let mejaData = result.id_meja
      let lastID = result.id_transaksi
      console.log(lastID);
      let detail = req.body.detail_transaksi
      detail.forEach(element => {
        element.id_transaksi = lastID;
      });
      console.log(detail);
      if (detail != null) {

        detail_transaksi.bulkCreate(detail)
          .then(result => {
            res.json({
              message: "Data has been inserted"
            })
          })
          .catch(error => {
            res.json({
              message: error.message
            })
          })
      }
      else {
        res.json({
          massage: "data not insert"
        })
      }
    })
    .catch(error => {
      console.log(error.message);
    })
})
// app.post("/", async (req, res) => {
//     let current = new Date().toISOString().split('T')[0]
//     let data = {
//         id_user: req.body.id_user,
//         tgl_transaksi: current,
//         id_meja: req.body.id_meja,
//         nama_pelanggan: req.body.nama_pelanggan,
//         status: "belum_bayar"
//     }
//     Transaksi.create(data)
//         .then(result => {
//             let lastID = result.id_transaksi
//             console.log(lastID);
//             let detail = req.body.detail_transaksi
//             detail.forEach(element => {
//                 element.id_transaksi = lastID;
//             });
//             console.log(detail);
//             detail_transaksi.bulkCreate(detail)
//                 .then(result => {
//                     res.json({
//                         message: "Data has been inserted"
//                     })
//                 })
//                 .catch(error => {
//                     res.json({
//                         message: error.message
//                     })
//                 })
//         })
//         .catch(error => {
//             console.log(error.message);
//         })
// })

//     // insert ke tabel transaksi
//     Transaksi
//         .create(newData)
//         .then((result) => {
//             // mengambil id terakhir dari transaksi
//             let transaksiID = result.id_transaksi;
//             // menyimpan detail_transaksi dari request ini dalam bentuk array
//             let dtlTransaksi = request.body.detail_transaksi;

//             // insert transaksiID ke tiap item di detail_transaksi
//             // (1 transaksi bisa memiliki beberapa detail_transaksi)
//             for (let i = 0; i < dtlTransaksi.length; i++) {
//                 dtlTransaksi[i].id_transaksi = transaksiID;
//             }
//             // console.log(detailTransaksi);
//             // insert semua detail_transaksi
//             // (termasuk id_transaksi yang diambil dari
//             // result.id ke setiap detail_transaksi yang berkaitan)

//             DetailTransaksi
//                 .bulkCreate(dtlTransaksi)
//                 .then((result) => {
//                     return response.json({
//                         success: true,
//                         message:
//                             result
//                     });
//                 })
//                 .catch((error) => {
//                     return response.json({
//                         success: false,
//                         message: error.message,
//                     });
//                 });
//         })
//         .catch((error) => {
//             return response.json({
//                 success: false,
//                 message: error.message,
//             });
//         });
// })
// app.post("/", (req, res) => {

//     let tableBooked = Meja.findAll({ attributes:['id_meja'],where: { status: "tersedia" } })

//     let bookedMejaIds = Array.from(tableBooked).map((meja) => meja.id_meja);

//     let tableAvailable = Array.from(tableBooked).slice(0, 1);

//     console.log(tableAvailable)


//     // for (let i = 0; i < tableAvailable.length; i++) {
//     let tw = Date.now()
//     let requestDataDetail = {
//         tgl_transaksi: tw,
//         id_user: req.body.id_user,
//         id_meja: tableAvailable[0]?.id_meja,
//         nama_pelanggan: req.body.nama_pelanggan,
//         status: "belum_bayar"
//     };
//     Transaksi.create(requestDataDetail)
//         .then((result) => {
//             res.json({
//                 data: result,
//             });
//         })
//         .catch((error) => {
//             return res.json({
//                 message: error.message,
//             });
//         });
// }

// })

// let tw = Date.now()
// let data = {
//     tgl_transaksi: new Date(tw),
//     id_user: req.body.id_user,
//     id_meja: req.body.id_meja,
//     nama_pelanggan: req.body.nama_pelanggan,
//     status: "belum_bayar"
// }

// Transaksi.create(data)
//     .then(result => {
//         var id_transaksi = result.id_transaksi;
//         var detail = [];
//         var data = req.body.detail;

//         data.forEach(d => {
//             detail.push({
//                 id_transaksi: id_transaksi,
//                 id_menu: d.id_menu,
//                 harga: d.harga,
//                 qty: d.qty
//             });
//         })

//         DetailTransaksi.bulkCreate(detail).then(() => {
//             res.status(200).send({
//                 message: 'ok'
//             })
//         }).catch(err => {
//             message: err.message
//         })
//         res.json({
//             message: "data has been inserted",
//             data: result.id_transaksi
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: error.message
//         })
//     })
// })

// app.post("/", (req, res) => {
//     const dataDetailTransaksi = DetailTransaksi.findAll({
//         include: [
//             {
//                 model: Transaksi,
//                 as: "transaksi",
//                 attributes: ["id_transaksi", "id_meja"],
//                 include: [
//                     {
//                         model: Meja,
//                         as: "meja",
//                         attributes: ["id_meja","status"],
//                         where:{
//                             status: "tersedia"
//                         }
//                     }
//                 ]
//             }
//         ]
//     })
//     const dataMeja = Meja.findAll()

//     let bokedMejaIds = dataDetailTransaksi[0].transaaksi[0].meja.map((meja) => meja.id_meja)
//     let availableMeja = dataMeja.filter((meja) => !bokedMejaIds.includes(meja.id_meja))

//     let mejaDataSelected = availableMeja.slice(0, 1)

//     for (let i = 0; i <= mejaDataSelected.length; i++) {
//         let reqData = {
//             tgl_transaksi: req.body.tgl_transaksi,
//             id_user: req.body.id_user,
//             id_meja: mejaDataSelected[0].id_meja,
//             nama_pelanggan: req.body.nama_pelanggan,
//             qty:req.body.qty,
//             harga:req.body.harga
//         }
//         transaksi.create(reqData)
//             .then((result) => {
//                 res.json({
//                     message: "data has been inserted",
//                     data: result
//                 })
//             })
//     }
// })

app.put("/:id", auth, mustLogin, mustBeKasir, (req, res) => {
  let param = { id_transaksi: req.params.id }
  let tw = Date.now()
  let data = {
    tgl_transaksi: new Date(tw),
    id_user: req.body.id_user,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: req.body.status
  }

  Transaksi.update(data, { where: param })
    .then(result => {
      res.json({
        message: "data has been updated",
        data: result
      })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})

app.delete("/:id", auth, mustLogin, mustBeKasirOrAdmin, (req, res) => {

  let param = { id_transaksi: req.params.id }
  Transaksi.destroy({ where: param })
    .then(result => {
      res.json({
        message: "data has been destroy"
      })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })

})




module.exports = app
import Jimp from "jimp";
import { converBase64ToImage } from "convert-base64-to-image";
import Tesseract from "tesseract.js";

const handler = async (req, res) => {
  console.log(req.body);
  if (req.method == "POST") {
    if (req.body.img !== null) {
      const base64 = req.body?.img;
      const pathToSaveImage = "./image.png";

      converBase64ToImage(base64, pathToSaveImage);
      const example1 = await Jimp.read(`./Alphabet/${req.body?.title}(1).png`);
      const example2 = await Jimp.read("./image.png");
      const check1 = example1.resize(300, Jimp.AUTO);
      const check2 = example2.resize(300, Jimp.AUTO);
      const distance = Jimp.distance(example1, example2);
      const diff = Jimp.diff(check1, check2);
      const result = diff.percent.toFixed(3) * 1000;
      const txt = await Tesseract.recognize("./image.png", "eng", {
        logger: (m) => m,
      }).then(({ data: { text } }) => {
        return text;
      });
      res.status(200).send({
        text: txt,
        result: 100 - result,
      });
    } else {
      res.status(200).send({
        message: "some think wrong",
      });
    }
  } else if (req.method == "GET") {
    res.status(200).send({
      message: "This is image deff AI APP",
    });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default handler;

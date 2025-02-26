import { encrypt } from "./../utils/encryption";
import mongoose from "mongoose";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

// Init data type
export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  createdAt?: string;
  activationCode: string;
}

const Schema = mongoose.Schema;
// Blueprint for User Schema
/* 
Sempat bingung kenapa masukin tipe data Number masih bisa, alasannya Mongoose ngubah 123 menjadi "123" secara otomatis.
Kalau mau benar benar STRING, harus ada validasi tambahan sebelum simpan ke DB
CONTOH : fullName: Yup.string().typeError("FullName harus string").required(),
*/
const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
      /*
        Atau bisa custom validasi disini : 
        validate: {
        validator: (value) => typeof value === "string",
        message: "FullName harus string!",
    },
        */
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true, // createdAt dan updatedAt automatic
  }
);

//Before save make sure the password is already encrpyt
UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id)
  next();
});

//Jika user sudah di daftarkan kirim email
UserSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    console.log("Send Email to: ", user.email);

    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create the model base on UserSchema
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

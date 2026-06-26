import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },

    mobileNumber: {
      type: String,
      unique: true,
      sparse: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationOtp: String,
    verificationOtpExpire: Date,
    resetOtp: String,
    resetOtpExpire: Date,

    // Dedicated admin OTP for admin panel login (do not mix with user OTP)
    adminLoginOtp: String,
    adminLoginOtpExpire: Date,


    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    referralCode: {
      type: String,
      unique: true
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    profilePicture: {
      type: String,
      default: ""
    },

    rewardPoints: {
      type: Number,
      default: 0
    },

    plan: {
      name: String,
      price: Number,
      buyDate: Date,
      expireDate: Date,
      paymentMethod: String,
      transactionId: String,
      isActive: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    if (!this.referralCode) {
      this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Subscription name is required'],
//         trim: true,
//         minLength: 2,
//         maxLength: 100,
//     },
//     price: {
//         type: String,
//         required: [true, 'Price is required'],
//         min: [0, 'Price must be greater that 0']
//     },
//     currency: {
//         type: String,
//         enum: ['INR', 'USD'],
//         default: 'INR'
//     },
//     frequency: {
//         type: String,
//         enum: ['daily', 'weekly', 'monthly', 'yearly'],
//     },
//     category: {
//         type: String,
//         enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['active', 'cancelled', 'expired'],
//         default: 'active',
//     },
//     startDate: {
//         type: Date,
//         required: true,
//         validate: {
//             validator: (value) => value <= new Date(),
//             message: 'Start date cannot be in the future'
//         }
//     },
//     renewalDate: {
//         type: Date,
//         // required: true,
//         validate: {
//             validator: function (value) {
//                 return value > this.startDate;
//             },
//             message: 'Renewal date must be after start date'
//         }
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         index: true,
//     }
// }, { timestamps: true });

// const subscriptionSchema.pre('save', function (next) {
//     if (!this.renewalDate) {
//         const renewalPeriods = {
//             daily: 1,
//             weekly: 7,
//             monthly: 30,
//             yearly: 365
//         };

//         this.renewalDate = new Date(this.startDate);
//         this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
//     }

//     if (this.renewalDate < new Date()) {
//         this.status = 'expired';
//     }
//     next();

// })

// const Subscription = mongoose.model('Subscription', subscriptionSchema);

// export default Subscription;


import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['INR', 'USD'],
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

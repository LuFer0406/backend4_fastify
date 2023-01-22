import { deleteImageCloudinary, uploadImageToCloudinary } from "../helpers/cloudinary.accions.js";
import { deleteImg } from "../helpers/deleteImg.js";
import { response } from "../helpers/response.js"
import { postModel } from "../models/post.model.js"

const postCtrl = {}

postCtrl.list = async (req, reply) => {
    try {
        const posts = await postModel.find().populate({path: "user", select: "-password"}).sort({createdAt: -1});
        response(reply, 200, true, posts, "Post list.")
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
};

postCtrl.listWithLogin = async (req, reply) => {
    try {
        req.userId // Id del usuario logueado
        const posts = await postModel.find({user: req.userId}).populate("user", {password: 0}).sort({createdAt: -1});
        response(reply, 200, true, posts, "User post list.")
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
};

postCtrl.listOne = async (req, reply) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id);

        // Validar si el registro exite
        if (!post) {
            return response(reply, 404, false, "","The record does not exist.")
        }

        response(reply, 200, true, post, "Record found successfully.")
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
}

postCtrl.add = async(req, reply) => {
    try {
        const {title, description} = req.body;

        const newPost = new postModel({
            title,
            description,
            user: req.userId
        });

        // Verificar la imagen -> Cloudinary
        if (req.file) {
            const {secure_url, public_id} = await uploadImageToCloudinary(req.file)
            newPost.setImg({secure_url, public_id});
        }

        await postModel.create(newPost);

        response(reply, 201, true, "", "Post created.")
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
}

postCtrl.delete = async(req, reply) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id);

        // Validar si existe el registro
        if (!post) {
            return response(reply, 404, false, "", "The record does not exist.");
        }

        // if (post.nameImage){
        //     deleteImg(post.nameImage);
        // }

        // Validar -> Cloudinary
        if (post.public_id) {
            await deleteImageCloudinary(post.public_id);
        }

        await post.deleteOne();
        response(reply, 200, true, "", "The post has been successfully deleted");
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
};

postCtrl.update = async(req, reply) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id);

        // Validar si existe el registro
        if (!post) {
            return response(reply, 404, false, "", "The record does not exist.");
        }

        if (req.file) {

            // post.nameImage && deleteImg(post.nameImage);

            // post.setImg(req.file.filename);

            // Validar -> Cloudinary
            if (post.public_id) {
            await deleteImageCloudinary(post.public_id);
        }

        const {secure_url, public_id} = await uploadImageToCloudinary(req.file)

        post.setImg({secure_url, public_id});

            await post.save();
        }

        
        await post.updateOne(req.body);
        response(reply, 200, true, "", "The post has been successfully updated");
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
};

export default postCtrl;
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Groq from "groq-sdk";
import { v2 as cloudinary } from "cloudinary";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		// 👇 Check if @threadbot is in the post
		if (text.toLowerCase().includes("@threadbot")) {
			const botUser = await User.findOne({ username: "threadBot" });
			if (botUser) {
				const prompt = `You are ThreadBot, a helpful and concise assistant like Grok on Twitter. Your job is to generate short, insightful, and engaging replies to tweets.

						This is a mini-project built by Saurabh, Chitvan, Muskan, and Awanish.

						Your style: witty, helpful, concise. Never exceed 2-3 lines.

						Here is the tweet/comment you need to respond to:

						"${text}"

						Now write your reply: just write the reply and nothing else reply like the user`;


				const groqReply = await groq.chat.completions.create({
					model: "compound-beta",
					messages: [{ role: "user", content: prompt }],
					stream: true,
					temperature: 0.6,
					top_p: 0.95,
					stop: null,
					max_tokens: 4096,
				});

				let botText = "";
				for await (const chunk of groqReply) {
					botText = chunk.choices[0]?.delta?.content;
				}

				// Save reply from bot to this post
				newPost.replies.push({
					userId: botUser._id,
					text: botText.trim(),
					userProfilePic: botUser.profilePic,
					username: botUser.username,
				});

				await newPost.save(); // Save again with the reply
			} else {
				console.log("threadBot user not found");
			}
		}

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Add user's reply to the post
		const reply = { userId, text, userProfilePic, username };
		post.replies.push(reply);

		// Check for @threadbot mention
		if (text.toLowerCase().includes("@threadbot")) {
			const botUser = await User.findOne({ username: "threadBot" });
			if (!botUser) {
				return res.status(500).json({ error: "threadBot user not found in DB" });
			}

			const prompt = `You are ThreadBot, a helpful and concise assistant like Grok on Twitter. Your job is to generate short, insightful, and engaging replies to tweets.

						This is a mini-project built by Saurabh, Chitvan, Muskan, and Awanish.

						Your style: witty, helpful, concise. Never exceed 2-3 lines.

						Here is the tweet/comment you need to respond to:

						"${text}"

						Now write your reply:`;

			const groqReply = await groq.chat.completions.create({
				model: "compound-beta",
				messages: [{ role: "user", content: prompt }],
				stream: true,
				temperature: 0.6,
				top_p: 0.95,
				stop: null,
				max_tokens: 4096,
			});

			// Collect streamed content
			let botText = "";
			for await (const chunk of groqReply) {
				botText += chunk.choices[0]?.delta?.content || "";
			}

			// Add threadBot's reply
			post.replies.push({
				userId: botUser._id,
				text: botText.trim(),
				userProfilePic: botUser.profilePic,
				username: botUser.username,
			});
		}

		await post.save();
		res.status(200).json({ message: "Replied successfully!" });
	} catch (err) {
		console.error("Error in replyToPost:", err);
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };

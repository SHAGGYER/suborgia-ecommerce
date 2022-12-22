<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // create

    public function create(Request $request)
    {
        $request->validate([
            "title" => "required",
            "content" => "required",
            "image" => "required",
            "tags" => "required"
        ]);

        $blogPost = new BlogPost();
        $blogPost->title = $request->input("title");
        $blogPost->content = $request->input("content");
        $blogPost->image = ProductsController::uploadFile($request->file("image"));
        $blogPost->tags = $request->input("tags");
        $blogPost->save();

        return response()->json(["content" => $blogPost]);
    }

    // update

    public function update(Request $request, $id)
    {
        $blogPost = BlogPost::find($id);
        $blogPost->title = $request->title;
        $blogPost->content = $request->content;
        $blogPost->tags = $request->tags;
        if ($request->file("image"))
            $blogPost->image = ProductsController::uploadFile(
                $request->file("image")
            );

        $blogPost->save();

        return response()->json(["content" => $blogPost]);
    }

    // delete

    public function delete(Request $request, $id)
    {
        BlogPost::destroy($id);

        return response()->json(["content" => "ok"]);
    }

    // search

    public function search(Request $request)
    {
        $blogPosts = BlogPost::query();

        $blogPosts = $this->handleAdditionalQuery($request, $blogPosts);
        $blogPosts = $this->handleOrderByQuery($request, $blogPosts);
        $blogPosts = $blogPosts->paginate(15);

        return response()->json(["content" => $blogPosts]);
    }

    // get one

    public function getOne(Request $request, $id)
    {
        $blogPost = BlogPost::find($id);

        return response()->json(["content" => $blogPost]);
    }
}

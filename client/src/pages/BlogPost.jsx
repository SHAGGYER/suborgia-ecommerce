import React from "react";
import { useParams } from "react-router-dom";
import Page from "../components/Page";
import { Wrapper } from "../components/Wrapper";
import HttpClient from "../services/HttpClient";
import styled from "styled-components";
import Loader from "../components/Loader";
import moment from "moment";
import { BlogService } from "../services/BlogService";

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  margin-bottom: 1rem;
  padding: 5rem;

  .header {
    span {
      font-size: 14px;
      color: #bebebe;
    }
  }

  img {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
`;

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    setLoading(true);
    const { data } = await HttpClient().get("/api/blog/" + id);
    setPost(data.content);
    setLoading(false);
  };
  return (
    <Page>
      <Wrapper>
        {loading && <Loader loading={loading} />}
        {post && (
          <PostContainer>
            <div className="header">
              <span>
                {moment(post.created_at).format("DD-MM-YYYY hh:mm a")}
              </span>
              <span> ({BlogService.readingTime(post.content)} min)</span>
            </div>
            <h1>{post.title}</h1>
            <img src={post.image} alt={post.title} />
            <p
              classname="content"
              dangerouslySetInnerHTML={{
                __html: `${post.content}`,
              }}
            />
          </PostContainer>
        )}
      </Wrapper>
    </Page>
  );
}

import React from "react";
import Page from "../components/Page";
import { Wrapper } from "../components/Wrapper";
import HttpClient from "../services/HttpClient";
import styled from "styled-components";
import moment from "moment";
import { BlogService } from "../services/BlogService";
import PrimaryButton from "../components/UI/PrimaryButton";
import Loader from "../components/Loader";
import { useHistory } from "react-router-dom";

const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const BlogItem = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid black;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .main-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem;

    h2 {
      font-size: 20px;
    }

    .content {
      flex: 1 1 auto;
    }

    a {
      color: var(--primary);
    }
  }

  .header {
    display: flex;
    gap: 0.25rem;
  }
`;

export default function Blog() {
  const history = useHistory();
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async (page = 1) => {
    setLoading(true);
    const { data } = await HttpClient().get("/api/blog?page=" + page || 1);
    setPosts([...posts, ...data.content.data]);
    setLastPage(data.content.last_page);
    setLoading(false);
    setPage(data.content.current_page);
  };

  const hasMore = () => {
    console.log(page, lastPage);
    return page < lastPage;
  };

  return (
    <Page>
      <Wrapper>
        <h1 style={{ marginBottom: "1rem" }}>Blog</h1>

        <BlogContainer>
          {posts.map((post, index) => (
            <BlogItem key={index}>
              <article className="image">
                <img src={post.image} alt={post.title} />
              </article>
              <article className="main-content">
                <div className="header">
                  <span>
                    {moment(post.created_at).format("DD-MM-YYYY hh:mm a")}
                  </span>
                  <span>({BlogService.readingTime(post.content)} min)</span>
                </div>
                <h2>{post.title}</h2>
                <p
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: `${post.content.substring(0, 200)}...`,
                  }}
                />
                <hr />
                <a href="#" onClick={() => history.push(`/blog/${post.id}`)}>
                  Read more
                </a>
              </article>
            </BlogItem>
          ))}
        </BlogContainer>

        {loading && <Loader loading={loading} />}

        <PrimaryButton
          disabled={!hasMore() || loading}
          onClick={() => getPosts(page + 1)}
        >
          Load more...
        </PrimaryButton>
      </Wrapper>
    </Page>
  );
}

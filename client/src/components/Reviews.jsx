import cogoToast from "cogo-toast";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import Rating from "./Rating";
import PrimaryButton from "./UI/PrimaryButton";
import moment from "moment";
import { useHistory } from "react-router-dom";

const ReviewsStyled = styled.div`
  border: 1px solid #efefef;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 5px;

  article {
    padding: 1rem;

    h1 {
      font-size: 40px;
    }
  }

  section {
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
  }

  section.no-user {
    position: relative;

    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #6e6e6e;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.3;
    }

    > article {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  textarea {
    width: 100%;
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const RatingStyled = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;

  .circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    span {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--primary);
    }
  }
`;

const RatingComponent = ({ rating, setRating }) => {
  const [currentRating, setCurrentRating] = React.useState(rating);
  const [selectedRating, setSelectedRating] = React.useState(rating);

  useEffect(() => {
    if (selectedRating !== -1) {
      setRating(selectedRating + 1);
    }
  }, [selectedRating]);

  useEffect(() => {
    if (rating === null) {
      setCurrentRating(-1);
      setSelectedRating(-1);
    }
  }, [rating]);

  const shouldShowRating = (index) => {
    return currentRating >= index || selectedRating >= index;
  };

  return (
    <RatingStyled>
      {[1, 2, 3, 4, 5].map((item, index) => (
        <div
          className="circle"
          key={index}
          onClick={() => setSelectedRating(index)}
          onMouseEnter={() => setCurrentRating(index)}
          onMouseLeave={() => setCurrentRating(-1)}
        >
          {shouldShowRating(index) && <span />}
        </div>
      ))}
    </RatingStyled>
  );
};

const UserRatingStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 0.25rem;

  .header {
    p {
      margin-top: 1rem;
    }
  }

  hr {
    border: 1px solid #ccc;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .review {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

export default function Reviews({ product }) {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (product) {
      getReviews(page);
    }

    return () => {};
  }, [product, page]);

  useEffect(() => {
    if (product) {
      getReviews();
    }

    return () => {};
  }, [product]);

  const getReviews = async (page, search) => {
    const { data } = await HttpClient().get(
      `/api/reviews?product_id=${product?.id}&page=${page || 1}&search=${
        search || ""
      }`
    );
    setReviews([...reviews, ...data.content.data]);
    setLastPage(data.content.last_page);
  };

  const onSubmit = async () => {
    const body = {
      rating,
      review,
      product_id: product.id,
    };

    await HttpClient().post("/api/reviews", body);
    setRating(null);
    setReview("");
    cogoToast.success("Review added successfully");
  };

  return (
    <ReviewsStyled>
      <h3>Reviews</h3>

      <section className={!user ? "no-user" : ""}>
        {!user && <div className="backdrop"></div>}
        {!user && (
          <article>
            <h1>You need to login!</h1>
            <h3>You need to login to write a review</h3>
            <PrimaryButton
              onClick={() =>
                history.push(`/login?returnUrl=/products/${product?.id}`)
              }
            >
              Go to Login
            </PrimaryButton>
          </article>
        )}

        <RatingComponent rating={rating} setRating={setRating} />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          placeholder="Write your review"
        />
        <PrimaryButton onClick={onSubmit}>Submit Review</PrimaryButton>
      </section>

      <div className="content">
        <h1 style={{ marginBottom: "1rem" }}>
          Average rating: {product.rating}
        </h1>

        {reviews?.map((item) => (
          <UserRatingStyled key={item.id}>
            <div className="header">
              <Rating rating={item.rating} />
              <p>
                <span>
                  {item.user ? item.user?.name : "User no longer available"}
                </span>
                <span>
                  {" "}
                  ({moment(item.created_at).format("DD-MM-YYYY hh:mm a")})
                </span>
              </p>
            </div>
            <hr />
            <div className="review">
              <p>{item.review}</p>
            </div>
          </UserRatingStyled>
        ))}
        <PrimaryButton
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
        >
          Load More
        </PrimaryButton>
      </div>
    </ReviewsStyled>
  );
}

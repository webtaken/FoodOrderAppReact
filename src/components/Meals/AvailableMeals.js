import React, { useEffect, useState, useCallback } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

import classes from "./AvailableMeals.module.css";

const AvailableMeals = props => {
  const [mealsListArray, setMealsListArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null); // limpiando algún error
    try {
      const response = await fetch(
        "https://food-order-app-192e1-default-rtdb.firebaseio.com/meals.json");

      if (!response.ok) {
        throw new Error("Something went wrong fetching the data :(");
      }
      const data = await response.json();

      const transformedMealsList = [];
      for (const idMeal in data) {
        transformedMealsList.push({
          id: idMeal,
          name: data[idMeal].name,
          description: data[idMeal].description,
          price: data[idMeal].price,
        });
      }
      setMealsListArray(transformedMealsList);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const mealsList = mealsListArray.map((meal) => {
    return <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price} />
  });

  let showLog = mealsList.length ? <ul>{mealsList}</ul> : <p>No found Meals :(</p>;

  if (isLoading) {
    showLog = <p>Loading...</p>;
  }
  if (error) {
    showLog = <p>{error}</p>;
  }

  return (
    <section className={classes.meals}>
      <Card>
        {showLog}
      </Card>
    </section>
  );
};

export default AvailableMeals;
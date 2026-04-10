# Restaurant Meal Data Entry Guide

## Best Format

The easiest way to give large batches of restaurant data is:

1. Use a spreadsheet
2. Keep one row per dish
3. Export or paste it using the column order from `docs/restaurant-meal-data-template.csv`

## Required Columns

- `restaurant_name`
- `address`
- `city`
- `state`
- `zip`
- `dish_name`
- `gluten_free`
- `soy_free`
- `nut_free`
- `kosher`
- `halal`

## Strongly Recommended Columns

- `price_label`
- `website`
- `phone`
- `confidence_level`
- `source_type`
- `notes`
- `last_verified`

## Allowed Values

For dietary columns, use:

- `yes`
- `no`
- `unknown`

For `confidence_level`, use:

- `high`
- `medium`
- `low`

For `source_type`, use:

- `restaurant_label`
- `menu_review`
- `staff_confirmation`
- `manual_research`
- `user_list`

## Practical Advice

- Repeat the restaurant information on every row for each dish
- Put only one dish on each row
- If you are unsure, use `unknown` instead of guessing
- Use the `notes` column to explain why an item meets the standard
- Send the data in batches if that feels easier

## Best Workflow For You

If you are adding a lot of entries, the cleanest workflow is:

1. Fill in a Google Sheet or Excel sheet using the template columns
2. Paste the rows here in batches
3. I will convert them into the app data and database format for you

## Recommended Batch Size

To keep things reliable, send:

- 20 to 40 rows at a time

That is large enough to move quickly, but small enough for me to validate carefully.

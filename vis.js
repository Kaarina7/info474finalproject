/* features:
filter based on city/state
aggregate based on month/year

COLUMN OPTIONS:
actual_mean_temp : The measured average temperature for that day
actual_min_temp : The measured minimum temperature for that day
actual_max_temp : The measured maximum temperature for that day
average_min_temp : The average minimum temperature on that day since 1880
average_max_temp : The average maximum temperature on that day since 1880
record_min_temp : The lowest ever temperature on that day since 1880
record_max_temp : The highest ever temperature on that day since 1880
record_min_temp_year : The year that the lowest ever temperature occurred
record_max_temp_year : The year that the highest ever temperature occurred
actual_precipitation : The measured amount of rain or snow for that day
average_precipitation : The average amount of rain or snow on that day since 1880
record_precipitation : The highest amount of rain or snow on that day since 1880

vis: scatterplot where you can filter for a specific location
x-axis: the date (can be aggregated by user)
y-axis: temp (specific value can be selected by user) + can have multiple values (i.e. separate lines/points)
size of point: precipitation (specific value can be selected by user)
*/
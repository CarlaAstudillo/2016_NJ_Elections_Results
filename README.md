# 2016 NJ Presidential Elections Results

![alt text](img/nj_north.png "NJ_Election_Map" =300)

![alt text](img/nj_south.png "NJ_Election_Map2"  =300)

On November 9, 2016, 17 NJAM reporters went to every county election board in New Jersey and got the unofficial presidential election results for every municipality in the state.

Using this data, the NJAM data team made several maps showing town-by-town map results and analysis for NJ.com and The Star-Ledger.

You can use this data for your own analysis. Contact [me](castudillo@njadvancemedia.com) or [Erin Petenko](epetenko@njadvancemedia.com) if you have any questions. Also, let us know what interesting trends you end up finding and what you end up making.

Note: These results were gathered the day after the election, and in many counties, provisional and mail-in ballots had still not been gathered. It's important to remember that these results could change from when the official results are posted in a couple of months.

The municipality codes, legislative and congressional district designations are from the Rutgers Data Book.

##Data Dictionary for Election CSV data

Click [here](data/njelection_results.csv) to dive directly into the csv. 

| COLUMNS       | DEFINITION           | 
| ------------- |:-------------| 
|**county**    |The county |
|**municipality**     | The municipality | 
| **muni_code** | The municipality code used to connect the csv to the topojson| 
|**ld**  |The legislative district the town belongs to|
|**cd**| The congressional district the town belongs to | 
|**census_code** | A Census number that serves as a key to join Census data| 
|**prez_dem**|Hillary Clinton, the Democratic candidate |
|**prez_rep**|Donald Trump, the Republican candidate| 
|**johnson** | Gary Johnson, the Liberterian candidate|
|**stein**|Jill Stein, the Green Party candidate|
|**castle**|Darrell Castle, the Constitution Party candidate| 
|**de_la_fuente** | Roque "Rocky" De La Fuente, the Reform Party candidate| 
|**kennedy**|Alyson Kennedy, the Socialist Workers Party candidate |
|**la_riva**|Gloria La Riva, the Party for Socialism and Liberation candidate| 
|**moorehead** | Monica Moorehead, the Workers World Party candidate| 
|**write-in** | Write-in ballots| 
|**total_votes**|Total votes cast in that town, as given by the county. If the county does not provide a total number, the tally is calculated by adding all votes for candidate and write-in ballots cast. | 
|**winner** | The winning candidate in that candidate. "Tie", if it's a tie. "None", if no numbers were provided for that city.|
|**first_place**|The number of votes received by the winning candidate |
|**second_place** | The number of votes received by the second place candidate|
|**margin_victory**|The margin of victory between the first and second place candidate |
|**prez_dem_per** | The percentage of the vote received by the Democratic candidate|
|**prez_rep_per**|The percentage of the vote received by the Republican candidate |
|**johnson_per** | The percentage of the vote received by the Liberterian candidate, Gary Johnson|
|**stein_per**|The percentage of the vote received by the Green Party candidate, Jill Stein |
|**others_total** | Total votes received by candidates that were not the Democratic or Republican candidate, includes Gary Johnson, Jill Stein and all other third-party candidates|
|**others_per**|Total percent of votes received by candidates that were not the Democratic or Republican candidate, includes Gary Johnson, Jill Stein and all other third-party candidates |





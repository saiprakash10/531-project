{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "5c2bc687",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 28,
   "id": "ed0223f9",
   "metadata": {},
   "outputs": [],
   "source": [
    "df1 = pd.read_csv(\"C:/Users/saura/Downloads/adit/data preprocessing/MedianHouseholdIncome2015.csv\", encoding='windows-1252')\n",
    "df2 = pd.read_csv(\"C:/Users/saura/Downloads/adit/data preprocessing/PercentagePeopleBelowPovertyLevel.csv\", encoding='windows-1252')\n",
    "df3 = pd.read_csv(\"C:/Users/saura/Downloads/adit/data preprocessing/ShareRaceByCity.csv\", encoding='windows-1252')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 31,
   "id": "3bf83956",
   "metadata": {},
   "outputs": [],
   "source": [
    "combined_df = pd.merge(df1, df2, on=['Geographic Area', 'City'], how='inner')\n",
    "combined_df = pd.merge(combined_df, df3, on=['Geographic Area', 'City'], how='inner')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 32,
   "id": "70224f43",
   "metadata": {},
   "outputs": [],
   "source": [
    "combined_df['City'] = combined_df['City'].replace({' city$': '', ' CDP$': '', ' town$': '', ' village$': ''}, regex=True)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 36,
   "id": "6677dda6",
   "metadata": {},
   "outputs": [],
   "source": [
    "df4 = pd.read_csv(\"C:/Users/saura/Downloads/adit/data preprocessing/PoliceKillingsUS.csv\", encoding='windows-1252')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 37,
   "id": "7ceca6b6",
   "metadata": {},
   "outputs": [],
   "source": [
    "final_combined = pd.merge(df4, combined_df, on=['Geographic Area', 'City'], how='left')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 46,
   "id": "1b9b6d91",
   "metadata": {},
   "outputs": [],
   "source": [
    "final_combined = final_combined.dropna(subset=['Median Income'])"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 48,
   "id": "468eb964",
   "metadata": {},
   "outputs": [],
   "source": [
    "final_combined = final_combined.dropna(subset=['age'])"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 61,
   "id": "692871f9",
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\2713526605.py:1: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['poverty_rate'] = pd.to_numeric(final_combined['poverty_rate'], errors='coerce')\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\2713526605.py:2: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Poverty Rate Below 30'] = final_combined['poverty_rate'] < 30\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\2713526605.py:3: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Poverty Rate 30-70'] = (final_combined['poverty_rate'] >= 30) & (final_combined['poverty_rate'] <= 70)\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\2713526605.py:4: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Poverty Rate Above 70'] = final_combined['poverty_rate'] > 70\n"
     ]
    }
   ],
   "source": [
    "final_combined['poverty_rate'] = pd.to_numeric(final_combined['poverty_rate'], errors='coerce')\n",
    "final_combined['Poverty Rate Below 30'] = final_combined['poverty_rate'] < 30\n",
    "final_combined['Poverty Rate 30-70'] = (final_combined['poverty_rate'] >= 30) & (final_combined['poverty_rate'] <= 70)\n",
    "final_combined['Poverty Rate Above 70'] = final_combined['poverty_rate'] > 70"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 64,
   "id": "1fc960d9",
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\3919404429.py:1: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Median Income'] = pd.to_numeric(final_combined['Median Income'], errors='coerce')\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\3919404429.py:2: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Median Income Below 25000'] = final_combined['Median Income'] < 25000\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\3919404429.py:3: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Median Income 25000-50000'] = (final_combined['Median Income'] >= 25000) & (final_combined['Median Income'] <= 50000)\n",
      "C:\\Users\\saura\\AppData\\Local\\Temp\\ipykernel_21476\\3919404429.py:4: SettingWithCopyWarning: \n",
      "A value is trying to be set on a copy of a slice from a DataFrame.\n",
      "Try using .loc[row_indexer,col_indexer] = value instead\n",
      "\n",
      "See the caveats in the documentation: https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy\n",
      "  final_combined['Median Income Above 50000'] = final_combined['Median Income'] > 50000\n"
     ]
    }
   ],
   "source": [
    "final_combined['Median Income'] = pd.to_numeric(final_combined['Median Income'], errors='coerce')\n",
    "final_combined['Median Income Below 25000'] = final_combined['Median Income'] < 25000\n",
    "final_combined['Median Income 25000-50000'] = (final_combined['Median Income'] >= 25000) & (final_combined['Median Income'] <= 50000)\n",
    "final_combined['Median Income Above 50000'] = final_combined['Median Income'] > 50000"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 70,
   "id": "9e66489a",
   "metadata": {},
   "outputs": [],
   "source": [
    "final_combined['date'] = pd.to_datetime(final_combined['date'])\n",
    "final_combined['Year'] = final_combined['date'].dt.year"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 72,
   "id": "526f0083",
   "metadata": {},
   "outputs": [],
   "source": [
    "final_combined.to_csv(\"C:/Users/saura/Downloads/adit/data preprocessing/final_combined.csv\", index=False)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.9.13"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}

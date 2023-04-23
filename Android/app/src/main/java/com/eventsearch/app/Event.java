package com.eventsearch.app;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.Arrays;

public class Event implements Parcelable {
    private String id;
    private String name;
    private String date;
    private String time;
    private String venue;
    private  String venueAddress;
    private String imageUrl;

    private String ticketStatus;
    private ArrayList<String> genres;

    private JSONArray artistsDetails;

    private JSONArray venueDetails;

    private JSONArray priceRanges;

    private String seatMap;

//    public Event(String name, String description, String date, String location) {
//        this.name = name;
//        this.date = date;
//        this.location = location;
//    }

    public Event(){

        genres = new ArrayList<>();
        artistsDetails = new JSONArray();
        venueDetails = new JSONArray();
    }

    protected Event(Parcel in) {
        name = in.readString();
        date = in.readString();
        time = in.readString();
        venue = in.readString();
        genres = in.createStringArrayList();
        imageUrl = in.readString();
        seatMap = in.readString();
        try {
            artistsDetails = new JSONArray(in.readString());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        try {
            venueDetails = new JSONArray(in.readString());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public static final Creator<Event> CREATOR = new Creator<Event>() {
        @Override
        public Event createFromParcel(Parcel in) {
            return new Event(in);
        }

        @Override
        public Event[] newArray(int size) {
            return new Event[size];
        }
    };

    public String getId() {
        return id;
    }
    public  void setId(String id){
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public  void setName(String name){
        this.name = name;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public ArrayList<String> getGenres() {
        return genres;
    }

    public void setGenres(ArrayList<String> genres) {
        this.genres = genres;
    }

    public void addGenre(String genre) {
        if(!genre.equalsIgnoreCase("undefined")){
            this.genres.add(genre);
        }
    }

    public void setImageUrl(String url){
        this.imageUrl = url;
    }

    public String getImageUrl(){
        return imageUrl;
    }

    public void setDate(String date){
        this.date = date;
    }

    public String getDate(){
        return date;
    }
    public void setTime(String time){
        this.time = time;
    }

    public String getTime(){
        return time;
    }

    public JSONArray getArtistsDetails(){
        return this.artistsDetails;
    }

    public void setArtistsDetails(JSONArray ad){
        this.artistsDetails = ad;
    }

    public JSONArray getVenueDetailsDetails(){
        return this.venueDetails;
    }
    public void setVenueDetails(JSONArray vd){
        this.venueDetails = vd;
    }

    public JSONArray getPriceRanges(){
        return this.priceRanges;
    }
    public void setPriceRanges(JSONArray pr){
        this.priceRanges = pr;
    }

    public  String getTicketStatus(){
        return this.ticketStatus;
    }

    public void setTicketStatus(String ts){
        this.ticketStatus = ts;
    }

    public  String getSeatMap(){
        return this.seatMap;
    }

    public void setSeatMap(String sm){
        this.seatMap = sm;
    }
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(@NonNull Parcel dest, int i) {
        dest.writeString(name);
        dest.writeString(date);
        dest.writeString(time);
        dest.writeString(venue);
        dest.writeStringList(genres);
        dest.writeString(imageUrl);
        dest.writeString(seatMap);
        if(artistsDetails != null){
            dest.writeString(artistsDetails.toString());
        }
        if(venueDetails != null){
            dest.writeString(venueDetails.toString());
        }

    }
}

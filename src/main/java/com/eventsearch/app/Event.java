package com.eventsearch.app;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

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
    private ArrayList<String> genres;

//    public Event(String name, String description, String date, String location) {
//        this.name = name;
//        this.date = date;
//        this.location = location;
//    }

    public Event(){
        genres = new ArrayList<>();
    }

    protected Event(Parcel in) {
        name = in.readString();
        date = in.readString();
        time = in.readString();
        venue = in.readString();
        genres = in.createStringArrayList();
        imageUrl = in.readString();
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
        this.genres.add(genre);
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

    }
}

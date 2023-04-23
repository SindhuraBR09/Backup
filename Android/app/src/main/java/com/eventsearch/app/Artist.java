package com.eventsearch.app;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

import java.util.ArrayList;

public class Artist implements Parcelable {

    private String name;
    private String popularity;
    private String followers;
    private String profilePicture;
    private ArrayList<String> albums;

    public Artist(){
        this.albums = new ArrayList<String>();

    }

    protected Artist(Parcel in) {
        name = in.readString();
        popularity = in.readString();
        profilePicture = in.readString();
        followers= in.readString();
        albums = in.createStringArrayList();

    }


    public static final Creator<Artist> CREATOR = new Creator<Artist>() {
        @Override
        public Artist createFromParcel(Parcel in) {
            return new Artist(in);
        }

        @Override
        public Artist[] newArray(int size) {
            return new Artist[size];
        }
    };

    public String getName(){
        return  name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getPopularity(){
        return  popularity;
    }

    public void setPopularity(String popularity){
        this.popularity = popularity;
    }

    public String getFollowers(){
        return  followers;
    }

    public void setFollowers(String followers){
        this.followers = followers;
    }

    public String getProfilePicture(){
        return  profilePicture;
    }

    public void setProfilePicture(String profilePicture){
        this.profilePicture = profilePicture;
    }

    public ArrayList<String> getAlbums(){
        return albums;
    }

    public void addAlbum(String album){
        albums.add(album);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(@NonNull Parcel dest, int i) {

        dest.writeString(name);
        dest.writeString(followers);
        dest.writeString(popularity);
        dest.writeString(profilePicture);
        dest.writeStringList(albums);

    }
}

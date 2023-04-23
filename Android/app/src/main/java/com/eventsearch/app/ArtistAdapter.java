package com.eventsearch.app;

import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class ArtistAdapter extends RecyclerView.Adapter<ArtistAdapter.ArtistViewHolder> {

    private List<Artist> mArtists;

    public ArtistAdapter(List<Artist> artists) {
        this.mArtists = artists;
    }

    public List<Artist> getmArtists(){
        return mArtists;
    }


    @NonNull
    @Override
    public ArtistAdapter.ArtistViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.artist_row, parent, false);

        // Create a new ViewHolder
        ArtistAdapter.ArtistViewHolder viewHolder = new ArtistAdapter.ArtistViewHolder(v);

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ArtistAdapter.ArtistViewHolder holder, int position) {
        Artist artist = mArtists.get(position);

        // Set the data for the views
        holder.mArtistName.setText(artist.getName());
        holder.mFollowers.setText(artist.getFollowers());

        Glide.with(holder.mProfilePicture.getContext())
                .load(artist.getProfilePicture())
                .into(holder.mProfilePicture);
        Glide.with(holder.mAlbum1.getContext())
                .load(artist.getAlbums().get(0))
                .into(holder.mAlbum1);
        Glide.with(holder.mAlbum2.getContext())
                .load(artist.getAlbums().get(1))
                .into(holder.mAlbum2);
        Glide.with(holder.mAlbum3.getContext())
                .load(artist.getAlbums().get(2))
                .into(holder.mAlbum3);

        holder.textViewProgress.setText(artist.getPopularity());
        int popularity = Integer.parseInt(artist.getPopularity());
        holder.progressBar.setProgress(popularity);
    }

    @Override
    public int getItemCount() {
        return mArtists.size();
    }

    public class ArtistViewHolder extends RecyclerView.ViewHolder {
        public TextView mArtistName;
        public TextView mFollowers;
        public ImageView  mProfilePicture;
        public ImageView mAlbum1;
        public ImageView mAlbum2;
        public ImageView mAlbum3;

        public ProgressBar progressBar;

        public  TextView textViewProgress;

        public ConstraintLayout mRowLayout;

        public ArtistViewHolder(View v) {
            super(v);
            mArtistName = v.findViewById(R.id.nameTextView);
            mFollowers = v.findViewById(R.id.followersTextView);
            mAlbum1 = v.findViewById(R.id.album1);
            mAlbum2 = v.findViewById(R.id.album2);
            mAlbum3 = v.findViewById(R.id.album3);
            mRowLayout = v.findViewById(R.id.event_row);
            mProfilePicture = v.findViewById(R.id.profilePicture);
            progressBar = v.findViewById(R.id.progress_bar);
            textViewProgress = v.findViewById(R.id.text_view_progress);

        }
    }

}


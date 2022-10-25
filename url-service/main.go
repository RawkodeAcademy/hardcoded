package main

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "short_links/short_links/pb"

	"google.golang.org/grpc/reflection"

	"github.com/google/uuid"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedURLServer
	shortenedUrls map[string]string
}

func (s *server) CreateShortLink(ctx context.Context, in *pb.CreateShortLinkRequest) (*pb.CreateShortLinkResponse, error) {
	shortLink := uuid.New().String()

	s.shortenedUrls[shortLink] = in.Url

	return &pb.CreateShortLinkResponse{
		Path: shortLink,
		Url:  in.Url,
	}, nil
}

func (s *server) ResolveShortLink(ctx context.Context, in *pb.ResolveShortLinkRequest) (*pb.ResolveShortLinkResponse, error) {
	if url, ok := s.shortenedUrls[in.Path]; ok {
		return &pb.ResolveShortLinkResponse{
			Url: url,
		}, nil
	}

	fmt.Printf("%v", s.shortenedUrls)

	return &pb.ResolveShortLinkResponse{
		Url: "FAILED",
	}, nil
}

func main() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer()
	reflection.Register(s)

	pb.RegisterURLServer(s, &server{
		shortenedUrls: make(map[string]string),
	})
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

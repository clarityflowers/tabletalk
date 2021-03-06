defmodule TabletalkWeb.Router do
  use TabletalkWeb, :router



  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :auth do
    plug Guardian.Plug.Pipeline, module: Tabletalk.Guardian,
                                  error_handler: Tabletalk.AuthErrorHandler
    plug Guardian.Plug.VerifyHeader, realm: "Bearer"
    plug Guardian.Plug.LoadResource
  end

  pipeline :require_up do
    plug TabletalkWeb.Plug.Status
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug ProperCase.Plug.SnakeCaseParams
  end

  scope "/auth", TabletalkWeb do
    pipe_through [:require_up, :api]

    get "/login", AuthController, :login
  end

  scope "/status", TabletalkWeb do
    pipe_through :api
    get "/", StatusController, :get
  end

  scope "/api", TabletalkWeb do
    pipe_through [:require_up, :api, :auth]

    resources "/users", UserController, only: [:create, :delete]
    resources "/games", GameController, only: [:create, :index, :show]
    scope "/games/:slug" do
      post "/join", GameController, :join
      get "/load", GameController, :load
    end
  end

  scope "/", TabletalkWeb do
    pipe_through :browser
    get "/*anything", PageController, :index
  end


  # scope "/", TabletalkWeb do
  #   pipe_through :api # Use the default browser stack

  #   get "/status", StatusController, :get
  #   # get "/", PageController, :index
  # end
end
